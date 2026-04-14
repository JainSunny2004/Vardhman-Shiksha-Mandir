import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

import { useContentBlocks, useEvents, useFaculty } from "@/hooks/useContentBlocks";

type SupabaseResult<T> = { data: T | null; error: Error | null };

class QueryBuilder<T> implements PromiseLike<SupabaseResult<T>> {
  public eq = vi.fn((column: string, value: unknown) => {
    this.filters.push({ column, value });
    return this;
  });

  public order = vi.fn((column: string, options: { ascending: boolean }) => {
    this.orders.push({ column, options });
    return this;
  });

  public limit = vi.fn((value: number) => {
    this.limits.push(value);
    return this;
  });

  public filters: Array<{ column: string; value: unknown }> = [];
  public orders: Array<{ column: string; options: { ascending: boolean } }> = [];
  public limits: number[] = [];

  constructor(private readonly result: SupabaseResult<T>) {}

  then<TResult1 = SupabaseResult<T>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.result).then(onfulfilled, onrejected);
  }
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("public content hooks", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("useContentBlocks maps and casts values for a section", async () => {
    const query = new QueryBuilder({
      data: [
        { field_key: "heading", value: "Hero Heading", content_type: "text" },
        { field_key: "active", value: "true", content_type: "boolean" },
        { field_key: "show_count", value: "4", content_type: "number" },
        { field_key: "items", value: '["a","b"]', content_type: "json" },
      ],
      error: null,
    });

    const select = vi.fn(() => query);
    fromMock.mockReturnValue({ select });

    const { result } = renderHook(() => useContentBlocks("home", "hero"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      heading: "Hero Heading",
      active: true,
      show_count: 4,
      items: ["a", "b"],
    });
    expect(fromMock).toHaveBeenCalledWith("content_blocks");
    expect(query.eq).toHaveBeenNthCalledWith(1, "page", "home");
    expect(query.eq).toHaveBeenNthCalledWith(2, "section", "hero");
  });

  it("useFaculty returns active faculty ordered by sort_order", async () => {
    const row = { id: "1", name: "Test", active: true, sort_order: 1 };
    const query = new QueryBuilder({ data: [row], error: null });
    const select = vi.fn(() => query);
    fromMock.mockReturnValue({ select });

    const { result } = renderHook(() => useFaculty(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([row]);
    expect(fromMock).toHaveBeenCalledWith("faculty");
    expect(query.eq).toHaveBeenCalledWith("active", true);
    expect(query.order).toHaveBeenCalledWith("sort_order", { ascending: true });
  });

  it("useEvents applies active filter, date ordering, and limit", async () => {
    const row = { id: "e1", title: "Event", active: true, sort_order: 0 };
    const query = new QueryBuilder({ data: [row], error: null });
    const select = vi.fn(() => query);
    fromMock.mockReturnValue({ select });

    const { result } = renderHook(() => useEvents(3), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([row]);
    expect(fromMock).toHaveBeenCalledWith("events");
    expect(query.eq).toHaveBeenCalledWith("active", true);
    expect(query.order).toHaveBeenCalledWith("event_date", { ascending: true });
    expect(query.limit).toHaveBeenCalledWith(3);
  });
});

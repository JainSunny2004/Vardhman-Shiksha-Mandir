import { createContext, useContext } from "react";

export type PreviewDraftData = Record<string, Record<string, unknown>>;

interface PreviewDraftContextValue {
  page: string;
  data: PreviewDraftData;
}

const PreviewDraftContext = createContext<PreviewDraftContextValue | null>(null);

export const PreviewDraftProvider = ({
  page,
  data,
  children,
}: {
  page: string;
  data: PreviewDraftData;
  children: React.ReactNode;
}) => {
  return <PreviewDraftContext.Provider value={{ page, data }}>{children}</PreviewDraftContext.Provider>;
};

export const usePreviewSectionDraft = <TSectionValues extends Record<string, unknown>>(
  page: string,
  section: string,
  fallback: TSectionValues,
) => {
  const context = useContext(PreviewDraftContext);
  if (!context || context.page !== page) {
    return fallback;
  }

  const sectionDraft = context.data[section];
  if (!sectionDraft) {
    return fallback;
  }

  return { ...fallback, ...sectionDraft } as TSectionValues;
};


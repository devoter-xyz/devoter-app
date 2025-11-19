import { Suspense } from "react";
import { CompareView } from "@/components/pages/compare/CompareView";
import { compareRepositoriesAction } from "@/actions/repository/compareRepositories/action";

interface ComparePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function ComparePageContent({ searchParams }: ComparePageProps) {
  const repoIdsParam = searchParams.repoIds;
  const repositoryIds = Array.isArray(repoIdsParam)
    ? repoIdsParam
    : repoIdsParam
    ? [repoIdsParam]
    : [];

  const { repositories, error } = await compareRepositoriesAction(repositoryIds);

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return <CompareView repositories={repositories || []} />;
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  return (
    <Suspense fallback={<div>Loading comparison...</div>}>
      <ComparePageContent searchParams={searchParams} />
    </Suspense>
  );
}

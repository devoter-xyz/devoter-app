"use client";

import { Repository } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CompareViewProps {
  repositories: Repository[];
}

export function CompareView({ repositories }: CompareViewProps) {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>No repositories selected for comparison.</p>
        <p>Add repositories to compare using the "Add to Compare" button on repository cards.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Repository Comparison</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo) => (
          <Card key={repo.id}>
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              <p className="text-sm text-gray-500">{repo.description || 'No description available'}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Votes:</strong> {repo.votesCount}
                </p>
                <p>
                  <strong>GitHub Stars:</strong> {repo.githubStars ?? "N/A"}
                </p>
                <p>
                  <strong>Submission Date:</strong>{" "}
                  {repo.createdAt
                    ? (() => {
                        const d = new Date(repo.createdAt);
                        return isNaN(d.getTime()) ? "N/A" : format(d, "PPP");
                      })()
                    : "N/A"}
                </p>
                {/* Add more comparison metrics here, e.g., voting trends */}
                <div className="flex flex-wrap gap-2">
                  {repo.tags && repo.tags.map((tag, index) => (
                    <Badge key={`${repo.id}-${tag}-${index}`} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const RepoCardSkeleton = () => {
  return (
    <div className="relative">
      <Card className="h-full w-full rounded-2xl p-6">
        <CardHeader className="flex items-start justify-between p-0">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex items-center flex-col gap-2">
              <Skeleton data-testid="skeleton" className="h-6 w-6 rounded-full" />
              <Skeleton data-testid="skeleton" className="h-6 w-6 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0 pt-6">
          <div className="flex items-center gap-2">
            <Skeleton data-testid="skeleton" className="h-6 w-6 rounded-full" />
            <Skeleton data-testid="skeleton" className="h-5 w-40" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton data-testid="skeleton" className="h-5 w-full" />
            <Skeleton data-testid="skeleton" className="h-5 w-5/6" />
          </div>
        </CardContent>
        <CardFooter className="p-0 pt-6">
          <div className="flex flex-wrap gap-2">
            <Skeleton data-testid="skeleton" className="h-8 w-20 rounded-lg" />
            <Skeleton data-testid="skeleton" className="h-8 w-24 rounded-lg" />
            <Skeleton data-testid="skeleton" className="h-8 w-16 rounded-lg" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RepoCardSkeleton;

import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Search() {
  const pathname = usePathname();

  const getPlaceholder = () => {
    if (pathname.startsWith('/favorites')) {
      return 'Search in favorites...';
    } else if (pathname.startsWith('/my-submissions')) {
      return 'Search in your submissions...';
    } else {
      return 'Search repositories, organizations, tags, maintainers';
    }
  };

  return (
    <div className="flex w-full max-w-lg items-center space-x-2">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder={getPlaceholder()}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Results</DialogTitle>
            <DialogDescription>
              Use the options below to filter your search results.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const SubmitRepositoryButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'>
          <Plus className='w-5 h-5' />
          Submit Repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Repository</DialogTitle>
            <DialogDescription>
              Add your repository
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};

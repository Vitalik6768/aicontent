"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AidialogProps = {
    aiResult: string;
};

export function Aidialog({ aiResult }: AidialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View AI Result</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Result</DialogTitle>
          <DialogDescription>
            The AI-generated result based on your input is shown below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <pre className="whitespace-pre-wrap p-4 bg-gray-100 rounded-md">
            {aiResult}
          </pre>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
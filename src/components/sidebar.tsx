// components/Sidebar.tsx
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash, MessageCircle, Menu } from "lucide-react";

export function Sidebar() {//{ onDeleteHistory }: { onDeleteHistory: () => void }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Chat Options</h2>

          <Button variant="outline" className="justify-start gap-2">
            <MessageCircle className="h-4 w-4" />
            New Chat
          </Button>

          <Button
            variant="destructive"
            className="justify-start gap-2"
            // onClick={onDeleteHistory}
          >
            <Trash className="h-4 w-4" />
            Clear History
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

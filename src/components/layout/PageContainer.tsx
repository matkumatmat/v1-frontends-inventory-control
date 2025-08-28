import { ScrollArea } from "@/components/ui/scroll-area"
// ===================================================================================
export const PageContainer = ({ children }) => {
    return (
        <ScrollArea className="flex-1">
            <main className="p-6 md:p-10">
                {children}
            </main>
        </ScrollArea>
    );
};
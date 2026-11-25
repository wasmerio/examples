import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ComponentShowcase } from '@/components/ComponentShowcase';
import { AdvancedShowcase } from '@/components/AdvancedShowcase';

export function ComponentTabs() {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="basic">Basic Components</TabsTrigger>
        <TabsTrigger value="advanced">Advanced Components</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <ComponentShowcase />
      </TabsContent>
      <TabsContent value="advanced">
        <AdvancedShowcase />
      </TabsContent>
    </Tabs>
  );
}

import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs.tsx";

const TabsButtons = (props:any) => {
    return (
        <Tabs defaultValue="portfolio" className="w-full ">
            <TabsList className={"bg-white dark:bg-n700  w-full px-2 py-8 rounded-xl"}>
                <TabsTrigger className={"w-full py-4 rounded-lg dark:data-[state=active]:text-primary-dark data-[state=active]:bg-light-theme dark:data-[state=active]:bg-dark-theme"} value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger className={"w-full py-4 rounded-lg dark:data-[state=active]:text-primary-dark data-[state=active]:bg-light-theme dark:data-[state=active]:bg-dark-theme"} value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio">
                {props.portfolio}
            </TabsContent>
            <TabsContent value="about">
                {props.about}
            </TabsContent>
        </Tabs>
    );
};

export default TabsButtons;
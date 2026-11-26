import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <div
      id="FAQ"
      className="mx-6 mt-60 flex flex-col items-center justify-center text-xl md:mx-40"
    >
      <h1 className="mb-10 text-center text-4xl md:text-left">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full text-left">
        <AccordionItem value="item-1">
          <AccordionTrigger>Can you do this particular job?</AccordionTrigger>
          <AccordionContent className="text-lg">
            Yes. We do that particular job multiple times a week, sometimes
            multiple times a day.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            I have been burned in the past, will that happen here?
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            Absoluetely not, we have a proven track record of successful jobs
            and satisfied clients. Don't believe us? Check out our customer
            reviews.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>When will you be available next?</AccordionTrigger>
          <AccordionContent className="text-lg">
            Our availablility is constantly changing, if you are interested in
            working together please conact us through our comapany email or
            phone, both can be found in our contact page.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

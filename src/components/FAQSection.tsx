import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-surface">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-headline text-primary mb-4">Questions, Answered</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Curtain Luxe smart curtains.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Wi-Fi vs Zigbee — which should I choose?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <strong>Wi-Fi:</strong> Direct internet connection, works with any router, easier setup. Best for single curtains or if you don't have a smart home hub.
                <br/><br/>
                <strong>Zigbee:</strong> Mesh network, more reliable, lower power consumption, requires a hub (included). Best for multiple curtains or existing smart home setups.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What happens during a power failure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Your curtains retain their last position during power outages. Once power is restored, they automatically reconnect to your network. Manual operation is always possible using the physical controls on the motor.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What's the maximum width and height?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <strong>Sliding Curtains:</strong> Up to 12 feet wide, 10 feet high
                <br/>
                <strong>Roller Curtains:</strong> Up to 8 feet wide, 12 feet high
                <br/><br/>
                For larger installations, we can configure multiple motors working in sync.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Is warranty valid with self-installation?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Our 2-year warranty covers all components regardless of installation method. We provide detailed video guides and 24/7 support during your installation. However, SOHUB installation includes additional setup optimization and on-site troubleshooting.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Does it support voice control?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Works with Amazon Alexa, Google Assistant, and Apple HomeKit. You can say "Alexa, open the living room curtains" or "Hey Google, close all curtains." Voice commands work for individual curtains or groups.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Delivery timeline & support policy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <strong>Delivery:</strong> 3-4 weeks from order confirmation (custom manufacturing)
                <br/>
                <strong>Support:</strong> 24/7 chat support, video call assistance, 2-year warranty
                <br/>
                <strong>Returns:</strong> 30-day return policy if not satisfied
                <br/><br/>
                We provide lifetime software updates and remote troubleshooting at no extra cost.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
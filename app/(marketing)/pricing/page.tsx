import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <main className="py-20 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center">Pricing</h1>
      <p className="mt-2 text-center text-muted-foreground">
        Simple, transparent pricing. No surprises.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• 5 meetings / month</li>
              <li>• Basic summaries</li>
              <li>• No voice playback</li>
            </ul>
            <Button className="w-full mt-6">Start Free</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Unlimited meetings</li>
              <li>• Priority task extraction</li>
              <li>• Custom African Voices</li>
              <li>• Real-time floating assistant</li>
            </ul>
            <Button className="w-full mt-6">Upgrade</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Unlimited seats</li>
              <li>• Team workspace</li>
              <li>• Admin controls</li>
            </ul>
            <Button className="w-full mt-6">Contact Sales</Button>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}

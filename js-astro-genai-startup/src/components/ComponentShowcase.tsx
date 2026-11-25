import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import { StatCard } from "@/components/StatCard";
import { Timeline } from "@/components/Timeline";
import {
  Zap,
  TrendingUp,
  Users,
  Activity,
  CheckCircle,
  Rocket,
  Code,
} from "lucide-react";

export function ComponentShowcase() {
  const [progress, setProgress] = useState(66);

  return (
    <div className="space-y-16">
      {/* Badges */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Badges</h2>
        <p className="text-muted-foreground mb-6">
          Display short labels with various styles and colors
        </p>
        <div className="space-y-6">
          <div className="p-8 rounded-2xl border bg-card">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="gradient">Gradient</Badge>
            </div>
            <CodeBlock
              code={`import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="gradient">Gradient</Badge>`}
            />
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Alerts</h2>
        <p className="text-muted-foreground mb-6">
          Display important messages with icons and dismiss functionality
        </p>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert with some helpful information.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please review your settings before continuing.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while processing your request.
            </AlertDescription>
          </Alert>

          <CodeBlock
            code={`import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>`}
          />
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Cards</h2>
        <p className="text-muted-foreground mb-6">
          Flexible container component for displaying content
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>
                Connect your AI models seamlessly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our REST API makes it easy to integrate powerful AI capabilities
                into your applications with just a few lines of code.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Featured Card</CardTitle>
              <CardDescription>
                Highlighted with a custom border
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards can be customized with different borders, backgrounds, and
                hover effects to match your design.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <CodeBlock
            code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
</Card>`}
          />
        </div>
      </section>

      {/* Spinners */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Spinners</h2>
        <p className="text-muted-foreground mb-6">
          Loading indicators in various sizes and styles
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <div className="flex items-center gap-8 mb-6">
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-xs mt-2 text-muted-foreground">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-xs mt-2 text-muted-foreground">Medium</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-xs mt-2 text-muted-foreground">Large</p>
            </div>
            <div className="text-center">
              <Spinner size="xl" />
              <p className="text-xs mt-2 text-muted-foreground">XL</p>
            </div>
          </div>
          <CodeBlock
            code={`import { Spinner } from "@/components/ui/spinner";

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" variant="secondary" />`}
          />
        </div>
      </section>

      {/* Progress */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Progress</h2>
        <p className="text-muted-foreground mb-6">
          Show completion status with animated progress bars
        </p>
        <div className="p-8 rounded-2xl border bg-card space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Custom Color</span>
              <span className="text-sm text-muted-foreground">33%</span>
            </div>
            <Progress
              value={33}
              indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setProgress(Math.max(0, progress - 10))}>
              Decrease
            </Button>
            <Button onClick={() => setProgress(Math.min(100, progress + 10))}>
              Increase
            </Button>
          </div>

          <CodeBlock
            code={`import { Progress } from "@/components/ui/progress";

<Progress value={66} />
<Progress value={33} indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500" />`}
          />
        </div>
      </section>

      {/* Tabs */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Tabs</h2>
        <p className="text-muted-foreground mb-6">
          Organize content into switchable sections
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="space-y-4">
              <p className="text-muted-foreground">
                This is the preview tab. You can display any content here.
              </p>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm">Preview content goes here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="code">
              <CodeBlock
                code={`function hello() {
  console.log("Hello from the code tab!");
}`}
                language="javascript"
              />
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configure your settings here.
                </p>
                <Input placeholder="Enter your setting..." />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <CodeBlock
              code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="preview">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">Preview content</TabsContent>
  <TabsContent value="code">Code content</TabsContent>
</Tabs>`}
            />
          </div>
        </div>
      </section>

      {/* Avatars */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Avatars</h2>
        <p className="text-muted-foreground mb-6">
          Display user profile images with fallbacks
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <div className="flex items-center gap-4 mb-6">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
          <CodeBlock
            code={`import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`}
          />
        </div>
      </section>

      {/* Stat Cards */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Stat Cards</h2>
        <p className="text-muted-foreground mb-6">
          Display key metrics with icons and trends
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value="50,234"
            change="+12.5% from last month"
            changeType="positive"
            icon={Users}
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Active Sessions"
            value="2,847"
            change="+8.2% from last week"
            changeType="positive"
            icon={Activity}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="AI Requests"
            value="1.2M"
            change="+45.1% from yesterday"
            changeType="positive"
            icon={Zap}
            gradient="from-yellow-500 to-orange-500"
          />
        </div>
        <div className="mt-6">
          <CodeBlock
            code={`import { StatCard } from "@/components/StatCard";
import { Users } from "lucide-react";

<StatCard
  title="Total Users"
  value="50,234"
  change="+12.5% from last month"
  changeType="positive"
  icon={Users}
  gradient="from-purple-500 to-pink-500"
/>`}
          />
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Timeline</h2>
        <p className="text-muted-foreground mb-6">
          Display events in chronological order
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <Timeline
            items={[
              {
                title: "Product Launch",
                description: "Released version 1.0 of our AI platform",
                date: "Jan 2025",
                icon: Rocket,
              },
              {
                title: "API v2 Released",
                description: "Launched faster, more efficient API",
                date: "Dec 2024",
                icon: Code,
              },
              {
                title: "Reached 50K Users",
                description: "Hit major milestone in user growth",
                date: "Nov 2024",
                icon: TrendingUp,
              },
              {
                title: "Company Founded",
                description: "Started the journey to democratize AI",
                date: "Jun 2024",
                icon: CheckCircle,
              },
            ]}
          />
          <div className="mt-6">
            <CodeBlock
              code={`import { Timeline } from "@/components/Timeline";
import { Rocket } from "lucide-react";

<Timeline
  items={[
    {
      title: "Product Launch",
      description: "Released version 1.0",
      date: "Jan 2025",
      icon: Rocket,
    },
  ]}
/>`}
            />
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Inputs</h2>
        <p className="text-muted-foreground mb-6">
          Form inputs with various types and styles
        </p>
        <div className="p-8 rounded-2xl border bg-card space-y-4">
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Search..." type="search" />
          <Input placeholder="Disabled input" disabled />

          <CodeBlock
            code={`import { Input } from "@/components/ui/input";

<Input placeholder="Email address" type="email" />
<Input placeholder="Password" type="password" />
<Input placeholder="Disabled input" disabled />`}
          />
        </div>
      </section>

      {/* Code Blocks */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Code Blocks</h2>
        <p className="text-muted-foreground mb-6">
          Display code with syntax highlighting and copy functionality
        </p>
        <CodeBlock
          code={`import { CodeBlock } from "@/components/CodeBlock";

function Example() {
  const message = "Hello, World!";
  console.log(message);
  return <div>{message}</div>;
}`}
          language="typescript"
          showLineNumbers={true}
        />
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-3xl font-bold mb-2">Buttons</h2>
        <p className="text-muted-foreground mb-6">
          Interactive buttons in various styles and sizes
        </p>
        <div className="p-8 rounded-2xl border bg-card">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button disabled>Disabled</Button>
              <Button>
                <Zap className="mr-2 h-4 w-4" />
                With Icon
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <CodeBlock
              code={`import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

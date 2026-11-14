import {createElement, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import '../starter-ui.js';

const component = (tag: string) => ({children, ...props}: {children?: ReactNode; slot?: string; href?: string; variant?: string; vertical?: string}) => createElement(tag, props, children);
const Starter = component('wasmer-starter');
const Card = component('wasmer-card');
const Stack = component('wasmer-stack');
const Title = component('wasmer-title');
const Text = component('wasmer-text');
const Badge = component('wasmer-badge');
const Action = component('wasmer-action');

export default function Home(): ReactNode {
  return <Layout title="Home" description="A Docusaurus docs site and blog served from Wasmer Edge">
    <Starter><Card>
      <Stack slot="header" vertical=""><Badge>Docusaurus</Badge><Title>Your documentation is live on Wasmer Edge</Title></Stack>
      <Text>Write Markdown documentation and blog posts. Docusaurus builds static files for Wasmer to serve.</Text>
      <Stack><Action href="/docs/intro">Read the docs</Action><Action href="/blog" variant="outline">Read the blog</Action></Stack>
      <Text slot="footer">Edit docs/ and blog/ to make this site yours.</Text>
    </Card></Starter>
  </Layout>;
}

<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";

  type Props = {
    label: string;
    href: string;
    count: number;
    Icon: any;
  };

  let { label, href, count, Icon }: Props = $props();
</script>

{#if count > 0}
    <Item.Root variant="outline" class="w-fit">
      {#snippet child({ props })}
        <a {href} {...props}>
          <Item.Media variant="icon">
            <Icon />
          </Item.Media>
          <Item.Content>
            <Item.Title>{label}</Item.Title>
            <Item.Description>{count}</Item.Description>
          </Item.Content>
        </a>
      {/snippet}
    </Item.Root>
{/if}

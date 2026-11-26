<script lang="ts">
import { cn } from '$lib/utils';

type Props = {
    projectId: string,
    id: string,
    src: string,
    markers?: string,
    class?: string,
}
const { projectId, id, src, markers, class: className }: Props = $props();

</script>

<map-image projectId={projectId} src={src} markers={markers} id={id} class="w-full">
    <div id={`map-${id}`} class={cn("map w-full aspect-square rounded-md", className)}>
    </div>
</map-image>

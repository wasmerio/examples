
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, ExternalLink, Github } from "lucide-react";

export function ProjectModal() {
  const { activeProject, isProjectModalOpen, closeProjectModal } = useUIStore();

  if (!activeProject) return null;

  return (
    <Dialog open={isProjectModalOpen} onOpenChange={(open) => !open && closeProjectModal()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
               <DialogTitle className="text-2xl font-bold tracking-tight">
                {activeProject.name}
              </DialogTitle>
          </div>
         
          <DialogDescription className="text-base pt-2 text-foreground/80 leading-relaxed">
            {activeProject.description || "No description provided."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
            <div className="flex flex-wrap gap-2">
                 {activeProject.language && <Badge variant="secondary">{activeProject.language}</Badge>}
                 {activeProject.topics && activeProject.topics.map((topic: string) => (
                     <Badge key={topic} variant="outline">{topic}</Badge>
                 ))}
                 <Badge variant="outline">Open Source</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Stars</span>
                    <span className="font-mono text-lg flex items-center gap-1"><Star className="h-3 w-3" /> {activeProject.stargazers_count}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Forks</span>
                    <span className="font-mono text-lg flex items-center gap-1"><GitFork className="h-3 w-3" /> {activeProject.forks_count}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Created</span>
                    <span className="font-mono text-sm pt-1">{new Date(activeProject.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Updated</span>
                    <span className="font-mono text-sm pt-1">{new Date(activeProject.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
             <Button className="w-full sm:w-auto" asChild>
                <a href={activeProject.html_url} target="_blank" rel="noreferrer" className="gap-2">
                    <Github className="h-4 w-4" />
                    View Code
                </a>
             </Button>
             {activeProject.homepage && (
                 <Button variant="secondary" className="w-full sm:w-auto" asChild>
                    <a href={activeProject.homepage} target="_blank" rel="noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                    </a>
                 </Button>
             )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

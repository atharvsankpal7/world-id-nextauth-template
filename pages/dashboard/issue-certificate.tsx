import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function IssueCertificate() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    candidateId: '',
    title: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: "Certificate Issued",
          description: "The certificate has been successfully issued on the blockchain.",
        });
        setFormData({ candidateId: '', title: '', description: '' });
      }
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      toast({
        title: "Error",
        description: "Failed to issue certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Issue New Certificate</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="candidateId">Candidate ID</Label>
            <Input
              id="candidateId"
              value={formData.candidateId}
              onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Certificate Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <Button type="submit">Issue Certificate</Button>
        </form>
      </Card>
    </div>
  );
}
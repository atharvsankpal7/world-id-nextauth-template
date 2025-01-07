import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function RequestCertificate() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [candidateId, setCandidateId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/certificates/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId }),
      });

      if (res.ok) {
        toast({
          title: "Request Sent",
          description: "Certificate access request has been sent to the candidate.",
        });
        setCandidateId('');
      }
    } catch (error) {
      console.error('Failed to request certificate:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Request Certificate Access</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="candidateId">Candidate ID</Label>
            <Input
              id="candidateId"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              placeholder="Enter candidate's World ID"
              required
            />
          </div>
          <Button type="submit">Send Request</Button>
        </form>
      </Card>
    </div>
  );
}
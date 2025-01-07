import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CertificateRequest {
  _id: string;
  organizationId: {
    name: string;
  };
  certificateId: {
    title: string;
  };
  requestDate: string;
  status: string;
}

export default function PendingRequests() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [requests, setRequests] = useState<CertificateRequest[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/certificates/requests');
      const data = await res.json();
      setRequests(data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/certificates/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });

      if (res.ok) {
        toast({
          title: `Request ${action}d`,
          description: `Certificate access request has been ${action}d.`,
        });
        fetchRequests();
      }
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} request. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Certificate Requests</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request._id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {request.certificateId.title}
                </h2>
                <p className="text-gray-600">
                  Requested by: {request.organizationId.name}
                </p>
                <p className="text-gray-500 text-sm">
                  Date: {new Date(request.requestDate).toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => handleRequest(request._id, 'approve')}
                  variant="default"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleRequest(request._id, 'reject')}
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
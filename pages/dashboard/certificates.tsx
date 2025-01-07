import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Certificate {
  _id: string;
  title: string;
  description: string;
  issueDate: string;
  issuerId: {
    name: string;
  };
}

export default function Certificates() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates/list');
      const data = await res.json();
      setCertificates(data.certificates);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Certificates</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <Card key={cert._id} className="p-6">
            <h2 className="text-xl font-semibold mb-2">{cert.title}</h2>
            <p className="text-gray-600 mb-4">{cert.description}</p>
            <div className="text-sm text-gray-500">
              <p>Issued by: {cert.issuerId.name}</p>
              <p>Date: {new Date(cert.issueDate).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
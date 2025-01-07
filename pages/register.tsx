import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Register() {
  const router = useRouter();
  const { worldId } = router.query;
  const [formData, setFormData] = useState({
    name: '',
    role: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, worldId }),
      });
      
      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-[400px] p-6">
        <h1 className="text-2xl font-bold mb-6">Complete Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label>Select Role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="issuer" id="issuer" />
                  <Label htmlFor="issuer">Issuer (Educational Institute)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="candidate" id="candidate" />
                  <Label htmlFor="candidate">Candidate (Student)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organization" id="organization" />
                  <Label htmlFor="organization">Organization (Employer)</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
              Complete Registration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
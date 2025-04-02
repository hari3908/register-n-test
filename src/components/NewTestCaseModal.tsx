
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTestCase } from '@/api/api';
import { useToast } from '@/hooks/use-toast';

interface NewTestCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onTestCaseAdded: (testCase: any) => void;
}

const NewTestCaseModal: React.FC<NewTestCaseModalProps> = ({ 
  isOpen, 
  onClose, 
  projectId, 
  onTestCaseAdded 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [status, setStatus] = useState('Not Run');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Test case title is required",
      });
      return;
    }
    
    try {
      setLoading(true);
      const newTestCase = await createTestCase({ 
        title, 
        description, 
        steps, 
        expectedResult, 
        status, 
        projectId 
      });
      
      onTestCaseAdded(newTestCase);
      toast({
        title: "Test case created",
        description: "Your new test case has been created successfully",
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating test case:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create test case. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSteps('');
    setExpectedResult('');
    setStatus('Not Run');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Test Case</DialogTitle>
          <DialogDescription>
            Add a new test case to your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test case title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter test case description"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="steps" className="text-sm font-medium">
                Steps
              </label>
              <Textarea
                id="steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="Enter test steps"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expectedResult" className="text-sm font-medium">
                Expected Result
              </label>
              <Textarea
                id="expectedResult"
                value={expectedResult}
                onChange={(e) => setExpectedResult(e.target.value)}
                placeholder="Enter expected result"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Run">Not Run</SelectItem>
                  <SelectItem value="Passed">Passed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Test Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTestCaseModal;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, getTestCasesByProject } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import NewTestCaseModal from '@/components/NewTestCaseModal';

interface Project {
  _id: string;
  name: string;
  description: string;
}

interface TestCase {
  _id: string;
  title: string;
  description: string;
  steps: string;
  expectedResult: string;
  status: 'Passed' | 'Failed' | 'Blocked' | 'Not Run';
  createdAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Passed':
      return 'bg-green-100 text-green-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    case 'Blocked':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProjectData = async () => {
      try {
        if (!projectId) return;
        
        const projectData = await getProjectById(projectId);
        setProject(projectData);
        
        const testCasesData = await getTestCasesByProject(projectId);
        setTestCases(testCasesData);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, user, navigate]);

  const handleAddTestCase = (newTestCase: TestCase) => {
    setTestCases([...testCases, newTestCase]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading project data...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Project not found</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1">{project.description || 'No description'}</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Test Case
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Test Cases</TabsTrigger>
            <TabsTrigger value="passed">Passed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="notrun">Not Run</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderTestCases(testCases)}
          </TabsContent>
          
          <TabsContent value="passed">
            {renderTestCases(testCases.filter(tc => tc.status === 'Passed'))}
          </TabsContent>
          
          <TabsContent value="failed">
            {renderTestCases(testCases.filter(tc => tc.status === 'Failed'))}
          </TabsContent>
          
          <TabsContent value="notrun">
            {renderTestCases(testCases.filter(tc => tc.status === 'Not Run'))}
          </TabsContent>
        </Tabs>
      </div>

      <NewTestCaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projectId={project._id}
        onTestCaseAdded={handleAddTestCase} 
      />
    </div>
  );

  function renderTestCases(cases: TestCase[]) {
    if (cases.length === 0) {
      return (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No test cases found</h3>
          <p className="text-gray-500 mb-4">Create your first test case for this project</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Test Case
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {cases.map((testCase) => (
          <Card key={testCase._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{testCase.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Created: {new Date(testCase.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(testCase.status)}>
                  {testCase.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {testCase.description && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium">Description:</h4>
                  <p className="text-sm text-gray-600">{testCase.description}</p>
                </div>
              )}
              
              {testCase.steps && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium">Steps:</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{testCase.steps}</p>
                </div>
              )}
              
              {testCase.expectedResult && (
                <div>
                  <h4 className="text-sm font-medium">Expected Result:</h4>
                  <p className="text-sm text-gray-600">{testCase.expectedResult}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default ProjectDetail;

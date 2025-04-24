
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import { GraduationCap, BookOpen, Trophy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  level: 1 | 2 | 3;
  progress: number;
  modules: number;
  completedModules: number;
  duration: string;
  completed: boolean;
}

interface TrainerCertification {
  id: string;
  name: string;
  company: string;
  certifications: {
    product: string;
    level: number;
    date: string;
  }[];
}

const courses: TrainingCourse[] = [
  {
    id: 'course-001',
    title: 'Bases du logiciel WEDA',
    description: 'Apprenez les fonctionnalités essentielles du logiciel WEDA',
    level: 1,
    progress: 100,
    modules: 5,
    completedModules: 5,
    duration: '2h',
    completed: true,
  },
  {
    id: 'course-002',
    title: 'Procédures d\'onboarding WEDA',
    description: 'Maîtrisez les procédures d\'installation et de configuration du logiciel WEDA',
    level: 2,
    progress: 60,
    modules: 8,
    completedModules: 5,
    duration: '3h',
    completed: false,
  },
  {
    id: 'course-003',
    title: 'Bases du logiciel Hellodoc',
    description: 'Découvrez les fonctionnalités clés de Hellodoc',
    level: 1,
    progress: 80,
    modules: 5,
    completedModules: 4,
    duration: '2h30',
    completed: false,
  },
  {
    id: 'course-004',
    title: 'Gestion de projet et qualité',
    description: 'Formation avancée sur la conduite de projets d\'onboarding',
    level: 3,
    progress: 0,
    modules: 10,
    completedModules: 0,
    duration: '5h',
    completed: false,
  },
];

const trainers: TrainerCertification[] = [
  {
    id: 'trainer-001',
    name: 'Jean Dupont',
    company: 'MediComputers',
    certifications: [
      { product: 'WEDA', level: 3, date: '15/10/2023' },
      { product: 'Hellodoc', level: 2, date: '20/11/2023' },
    ],
  },
  {
    id: 'trainer-002',
    name: 'Sophie Moreau',
    company: 'DocTech Systems',
    certifications: [
      { product: 'DocManager', level: 3, date: '05/09/2023' },
      { product: 'PatientFlow', level: 3, date: '10/12/2023' },
    ],
  },
  {
    id: 'trainer-003',
    name: 'Lucas Bernard',
    company: 'MediComputers',
    certifications: [
      { product: 'MediSoft', level: 2, date: '25/08/2023' },
      { product: 'WEDA', level: 1, date: '03/12/2023' },
    ],
  },
];

export default function Training() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinueCourse = (course: TrainingCourse) => {
    toast({
      title: 'Reprise de la formation',
      description: `Reprise de la formation "${course.title}"`,
    });
  };

  const handleStartCourse = (course: TrainingCourse) => {
    toast({
      title: 'Début de la formation',
      description: `Vous commencez la formation "${course.title}"`,
    });
  };

  const handleViewCertification = (trainer: TrainerCertification) => {
    toast({
      title: 'Certifications consultées',
      description: `Consultation des certifications de ${trainer.name}`,
    });
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centre de formation</h1>
          <p className="text-muted-foreground">Développez vos compétences et obtenez des certifications</p>
        </div>
      </div>

      <Tabs defaultValue="courses" className="mt-6">
        <TabsList>
          <TabsTrigger value="courses">Formations</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <Badge variant={course.level === 1 ? 'outline' : course.level === 2 ? 'secondary' : 'default'}>
                      Niveau {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {course.completedModules}/{course.modules} modules
                        </span>
                      </div>
                      <div>{course.duration}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progression</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {course.completed ? (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Formation terminée</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoir
                      </Button>
                    </div>
                  ) : course.progress > 0 ? (
                    <Button
                      className="w-full"
                      onClick={() => handleContinueCourse(course)}
                    >
                      Continuer
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleStartCourse(course)}
                    >
                      Commencer
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="certifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications des formateurs</CardTitle>
              <CardDescription>
                Niveau 1: Bases du logiciel • Niveau 2: Procédures d'onboarding • Niveau 3: Gestion de projet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={trainer.name} size="md" />
                        <div>
                          <h3 className="font-medium">{trainer.name}</h3>
                          <p className="text-sm text-muted-foreground">{trainer.company}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewCertification(trainer)}
                      >
                        <Trophy className="h-5 w-5 text-primary" />
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {trainer.certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md bg-muted p-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>{cert.product}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={cert.level === 1 ? 'outline' : cert.level === 2 ? 'secondary' : 'default'}>
                              Niveau {cert.level}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {cert.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir toutes les certifications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

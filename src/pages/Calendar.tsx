
import React from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduledEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'activation' | 'training';
  clientName: string;
  participants: string[];
  status: 'pending' | 'confirmed' | 'completed';
}

const mockEvents: ScheduledEvent[] = [
  {
    id: 'event-001',
    title: 'Activation WEDA',
    date: new Date(2025, 3, 25), // April 25, 2025
    time: '10:00 - 12:00',
    type: 'activation',
    clientName: 'Cabinet Dr. Martin',
    participants: ['Jean Dupont', 'Sophie Moreau'],
    status: 'confirmed',
  },
  {
    id: 'event-002',
    title: 'Formation Hellodoc',
    date: new Date(2025, 3, 26), // April 26, 2025
    time: '14:00 - 17:00',
    type: 'training',
    clientName: 'Centre Medical Dubois',
    participants: ['Lucas Bernard'],
    status: 'pending',
  },
  {
    id: 'event-003',
    title: 'Activation PatientFlow',
    date: new Date(2025, 3, 28), // April 28, 2025
    time: '09:00 - 11:00',
    type: 'activation',
    clientName: 'Clinique Saint-Pierre',
    participants: ['Emma Martin', 'Jean Dupont'],
    status: 'confirmed',
  },
];

export default function Calendar() {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [viewType, setViewType] = React.useState('month');

  // Get events for the selected date
  const selectedDateEvents = mockEvents.filter(
    (event) => date && event.date.toDateString() === date.toDateString()
  );

  // Function to handle event selection
  const handleEventSelect = (event: ScheduledEvent) => {
    toast({
      title: `${event.title}`,
      description: `${event.clientName} - ${event.time}`,
    });
  };

  // Function to handle participant action
  const handleParticipantAction = (event: ScheduledEvent, action: 'join' | 'confirm') => {
    toast({
      title: action === 'join' ? 'Participation ajoutée' : 'Participation confirmée',
      description: `Vous avez ${
        action === 'join' ? 'rejoint' : 'confirmé'
      } l'événement "${event.title}"`,
    });
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Calendrier</h1>
        <div className="flex space-x-2">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDate(new Date())}>Aujourd'hui</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendrier des activations et formations</CardTitle>
            <CardDescription>
              Sélectionnez une date pour voir les événements planifiés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              // Highlight dates with events
              modifiers={{
                booked: mockEvents.map((event) => event.date),
              }}
              modifiersStyles={{
                booked: { fontWeight: 'bold', backgroundColor: 'hsl(var(--primary) / 0.1)' },
              }}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Événements du {date?.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Aucun événement planifié pour cette date
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      onClick={() => handleEventSelect(event)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <StatusBadge
                          status={
                            event.status === 'pending'
                              ? 'pending'
                              : event.status === 'confirmed'
                              ? 'scheduled'
                              : 'completed'
                          }
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{event.clientName}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Users className="h-3 w-3" />
                        <span>{event.participants.length} participants</span>
                      </div>

                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParticipantAction(event, 'join');
                          }}
                        >
                          Rejoindre
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParticipantAction(event, 'confirm');
                          }}
                        >
                          Confirmer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => setDate(new Date())}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Voir tous les événements
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedDateEvents.length > 0
                  ? selectedDateEvents.flatMap((event) =>
                      event.participants.map((participant, index) => (
                        <div key={`${event.id}-${index}`} className="flex items-center space-x-2">
                          <UserAvatar name={participant} size="sm" />
                          <div>
                            <p className="text-sm font-medium">{participant}</p>
                            <p className="text-xs text-muted-foreground">{event.title}</p>
                          </div>
                        </div>
                      ))
                    )
                  : <p className="text-center text-sm text-muted-foreground">
                      Aucun participant pour cette date
                    </p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

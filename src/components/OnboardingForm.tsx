import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fetchCompanies, createOnboarding, OnboardingFormData } from "@/services/onboardingService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fr } from "date-fns/locale";

// Schema for onboarding form
const formSchema = z.object({
  clientName: z.string().min(2, "Le nom du client est requis"),
  itrCompany: z.string().min(1, "L'entreprise ITR est requise"),
  contactEmail: z.string().email("Adresse email invalide"),
  contactPhone: z.string().min(10, "Un numéro de téléphone valide est requis"),
  trainer: z.string().optional(),
  bdcDate: z.date({ required_error: "La date BDC est requise" }),
  products: z.array(z.string()).min(1, "Au moins un produit est requis"),
  numDoctors: z.number().min(0, "Le nombre ne peut pas être négatif"),
  numParamedical: z.number().min(0, "Le nombre ne peut pas être négatif"),
  numSecretaries: z.number().min(0, "Le nombre ne peut pas être négatif"),
  isMsp: z.boolean().default(false),
  obFeesActivated: z.boolean().default(true),
  preferredDate: z.date().optional(),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface OnboardingFormProps {
  onSubmit: (data: OnboardingFormData) => void;
}

export function OnboardingForm({ onSubmit }: OnboardingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      itrCompany: "",
      contactEmail: "",
      contactPhone: "",
      trainer: "",
      products: [],
      numDoctors: 0,
      numParamedical: 0,
      numSecretaries: 0,
      isMsp: false,
      obFeesActivated: true,
      comments: "",
    },
  });

  const [itrCompanies, setItrCompanies] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample products (would come from API in a real app)
  const availableProducts = [
    "WEDA",
    "Hellodoc",
    "MediSoft",
    "MedicalOne",
    "DocManager",
    "PatientFlow",
  ];

  useEffect(() => {
    const loadCompanies = async () => {
      const companies = await fetchCompanies();
      setItrCompanies(companies);
    };
    
    loadCompanies();
  }, []);

  const handleFormSubmit = async (data: FormValues) => {
    // Convert the form values to OnboardingFormData
    const onboardingData: OnboardingFormData = {
      clientName: data.clientName,
      itrCompany: data.itrCompany,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      trainer: data.trainer,
      bdcDate: data.bdcDate,
      products: data.products,
      numDoctors: data.numDoctors,
      numParamedical: data.numParamedical,
      numSecretaries: data.numSecretaries,
      isMsp: data.isMsp,
      obFeesActivated: data.obFeesActivated,
      preferredDate: data.preferredDate,
      comments: data.comments
    };

    setIsSubmitting(true);
    try {
      const success = await createOnboarding(onboardingData);
      if (success) {
        setTimeout(() => {
          navigate("/onboardings");
        }, 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8 rounded-lg border p-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du cabinet client *</FormLabel>
                <FormControl>
                  <Input placeholder="Cabinet médical..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="itrCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entreprise ITR destinataire *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une entreprise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itrCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email du contact *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contact@cabinet.fr"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone du contact *</FormLabel>
                <FormControl>
                  <Input placeholder="01 23 45 67 89" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="trainer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du formateur (si défini)</FormLabel>
              <FormControl>
                <Input placeholder="Jean Dupont" {...field} />
              </FormControl>
              <FormDescription>
                Vous pouvez laisser vide si non défini à ce stade
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bdcDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de réception BDC *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionnez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Produits concernés + quantités *</FormLabel>
          {availableProducts.map((product) => (
            <div key={product} className="flex items-center space-x-2">
              <Checkbox
                id={`product-${product}`}
                onCheckedChange={(checked) => {
                  const currentProducts = form.getValues("products") || [];
                  
                  if (checked) {
                    form.setValue("products", [
                      ...currentProducts,
                      product,
                    ]);
                  } else {
                    form.setValue(
                      "products",
                      currentProducts.filter((p) => p !== product)
                    );
                  }
                }}
              />
              <label
                htmlFor={`product-${product}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {product}
              </label>
              <Input
                className="ml-auto w-20"
                type="number"
                min="0"
                placeholder="Qté"
                onChange={(e) => {
                  // Dans une vraie app, vous stockeriez ces quantités séparément
                  console.log(
                    `Quantité pour ${product}: ${e.target.value}`
                  );
                }}
              />
            </div>
          ))}
          {form.formState.errors.products?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.products?.message}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <FormLabel>Nombre de personnels à former</FormLabel>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="numDoctors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médecins</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numParamedical"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paramédicaux</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numSecretaries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secrétaires</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <FormField
            control={form.control}
            name="isMsp"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Présence en MSP?</FormLabel>
                  <FormDescription>
                    Cochez si le cabinet est une Maison de Santé Pluridisciplinaire
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="obFeesActivated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>OB Fees activés?</FormLabel>
                  <FormDescription>
                    Frais d'onboarding applicables
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preferredDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date souhaitée de formation</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionnez une date (optionnel)</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Date souhaitée par le client (indicative)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaires additionnels</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informations supplémentaires..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Création en cours..." : "Créer l'onboarding"}
        </Button>
      </form>
    </Form>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionAnswerCardProps {
  questionNumber: number;
  question: string;
  answer: string;
}

export default function QuestionAnswerCard({
  questionNumber,
  question,
  answer,
}: QuestionAnswerCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Question {questionNumber}
          </Badge>
          <CardTitle className="text-base">{question}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {answer}
        </p>
      </CardContent>
    </Card>
  );
}
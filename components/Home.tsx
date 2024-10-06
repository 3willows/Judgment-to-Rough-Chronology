"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { judgmentToChronology } from "@/app/judgmentToChronology"

interface DateSentence {
  date: string
  sentence: string
}

interface Case {
  id: string
  title: string
  url: string
}

export function Home() {
  const [query, setQuery] = useState("")
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [chronology, setChronology] = useState<DateSentence[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSearching(true)
    try {
      // Replace this with actual API call to search for cases
      const result = await fetch(`https://caselaw.nationalarchives.gov.uk/judgments/search?=${encodeURIComponent(query)}`)
      const data = await result.json()
      setCases(data)
    } catch (error) {
      console.error("Error searching cases:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCaseSelect = (caseId: string) => {
    const selectedCase = cases.find(c => c.id === caseId)
    setSelectedCase(selectedCase || null)
  }

  const handleSubmit = async () => {
    if (!selectedCase) return
    setIsLoading(true)
    try {
      const result = await judgmentToChronology(selectedCase.url)
      setChronology(result)
    } catch (error) {
      console.error("Error fetching chronology:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Chronology of a Judgment</CardTitle>
          <CardDescription>
            Search for a case and get a list of dates mentioned in the judgment, in chronological order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="Enter search query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                disabled={isSearching}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Cases
                </>
              )}
            </Button>
          </form>
          {cases.length > 0 && (
            <div className="mt-4">
              <Select onValueChange={handleCaseSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCase && (
                <Button onClick={handleSubmit} className="w-full mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Chronology...
                    </>
                  ) : (
                    "Generate Chronology"
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {isLoading ? (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground mt-2">
              Generating rough chronology...
            </p>
          </CardContent>
        </Card>
      ) : chronology ? (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Rough Chronology</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chronology.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.sentence}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
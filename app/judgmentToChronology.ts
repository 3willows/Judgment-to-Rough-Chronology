"use server"

import { createClient } from "../utils/supabase/server"
import { fetchAndExtract } from "./_parsingDates/fetchAndExtract"

export async function judgmentToChronology(url: string) {
  "use server"
  const supabase = createClient()

  const cleanedUrl = url.split('?')[0]

  try {
    // Fetch the XML data
    const response = await fetch(`${cleanedUrl}/data.xml`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // Read the response body as text
    const xmlContent = await response.text()

    // Insert the XML content into the database
    const { data, error } = await supabase
      .from("judgments")
      .insert({ xml: xmlContent })
      .select('id')
      .single()
      
    // Call utility function to extract dates 
    const chronology = await fetchAndExtract(data?.id)
    // console.log(chronology)    
    if (error) {
      console.error("Error inserting data:", error)
      return null
    } else {
      console.log("Inserted data and created chronology:", data)
      console.dir(data.id)
      return chronology
    }
  } catch (error) {
    console.error("Error fetching or processing XML:", error)
    return null
  }
}

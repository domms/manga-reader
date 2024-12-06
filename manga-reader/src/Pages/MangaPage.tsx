/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CardMedia, Container, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChapterList from "../Components/ChapterList";
import { useEffect, useState } from "react";

interface Props {
  title?: string
}

interface ChapterDetails {
  id: string,
  attributes: {
    title?: string,
    pages?: number,
    volume?: string,
    chapter?: string,
    readableAt?: string
  }
}

const MangaPage = (props: Props) => {
  const matches = useMediaQuery('(min-width:600px)');
  const location = useLocation();

  const [chapters, setChapters] = useState<ChapterDetails[]>([]);
  //const [offset, setOffset] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
        await fetch(`https://api.mangadex.org/chapter?limit=100&offset=${0}&manga=${location.state.details.id}&translatedLanguage%5B%5D=en&translatedLanguage%5B%5D=uk&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&contentRating%5B%5D=erotica&contentRating%5B%5D=pornographic&includeFutureUpdates=1&order%5BcreatedAt%5D=asc`)
        .then((res) => {
            return res.json();
        })
        .then(async (data) => {
          //await setChapters(data.data);
          console.log('data:',data)
          await setChapters([...chapters, ...data.data]);
          //implement rate limit to avoid IP ban

          // if(data.data.length === 100) {
          //   setOffset(offset + 100)
          // }
      });
    }
    fetchData()
    
    .catch(console.error)

  }, []);

  console.log(chapters)

  return (
    <Container fixed>
    <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm:'row'}}}>
    <CardMedia
        component="img"
        sx={{ height: '358.39px', width: '256px' }}
        image={location.state.details.img ?? 'Image not found.'}
        alt={`${props.title} cover image not found.`}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography p={2} variant="h5">{location.state.details.title}</Typography>
      <Stack paddingLeft={2} paddingRight={2} paddingBottom={2} direction={'row'}>
      {location.state.details.tags.map((tag: string, index: number) => {
                return <Typography gap={2} key={index} variant="caption">{index !== location.state.details.tags.length-1 ? `${tag}, ` : `${tag}`} </Typography>
            })}
      </Stack>
        {matches ? 
        <Paper sx={{p:2}}>
          <Typography variant="caption">
            {location.state.details.description}
          </Typography> 
        </Paper>
        : 
        <Accordion>
        <AccordionSummary
          expandIcon={<KeyboardArrowDownIcon />}
        >
          <Typography>Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography variant="caption">
          {location.state.details.description}
        </Typography>
        </AccordionDetails>
      </Accordion>
        }
      </Box>
    </Box>
    <Box sx={{ display: 'flex', paddingTop: 2, paddingBottom: 2 }}>
        <Button variant="outlined" color="success">Read Latest Chapter</Button>
    </Box>
    <Stack>
      <ChapterList chapterItems={chapters}/>
    </Stack>
    </Container>
  )
}

export default MangaPage
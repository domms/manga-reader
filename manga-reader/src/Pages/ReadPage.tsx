import { Box, Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


const ReadPage = () => {
const [pages, setPages] = useState<string[]>()
const location = useLocation();
useEffect(() => {
    const fetchData = async () => {
        await fetch(`https://api.mangadex.org/at-home/server/${location.state.chapter}`)
        .then((res) => {
            return res.json();
        })
        .then(async (data) => {
          console.log('data:',data)
          const pageList: string[] = [];
          const baseUrl = data.baseUrl;
          const hash = data.chapter.hash;
          data.chapter.data.forEach((item: string) => {
            const imgUrl = `${baseUrl + '/data/' + hash + '/' + item}`
            pageList.push(imgUrl);
          })
          setPages(pageList)
      });
    }
    fetchData()
    .catch(console.error)
  }, []);
  console.log(pages)
//console.log('location data:', location.state)
  return (
    <>
    <Container sx={{display: "flex", alignItems: "center", flexDirection: "column"}}>
    {pages && pages.map((page, i) => {
        return <Box sx={{maxWidth: '1920px'}} component={'img'} src={page} key={i}></Box>
    })}
    <Button>Next chapter</Button>
    </Container>
    </>
    
  )
}

export default ReadPage
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import MangaCard from '../Components/MangaCard';
import { Button, Container, Grid2 } from '@mui/material';

const HomePage = () => {

    const [list, setList] = useState<any[]>([]);
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`https://api.mangadex.org/manga?limit=10&offset=${offset}&includedTagsMode=AND&excludedTagsMode=OR&status%5B%5D=completed&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&contentRating%5B%5D=erotica&contentRating%5B%5D=pornographic&order%5BlatestUploadedChapter%5D=desc&includes%5B%5D=cover_art`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setList([...list, ...data.data]);
          });
        }
        fetchData()
        .catch(console.error)
      }, [offset]);

      //console.log(list)

  return (
    <Container fixed>
    <Grid2
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
          size={{xs: 12, sm: 6, md: 3}}
    > 

          {list && list.map((item, i) => {
              let img = '';
              const tags: string[] = [];
              const lastChapter = item.attributes.lastChapter ?? '';
              const status = item.attributes.status ?? 'unknown';
              item.relationships.forEach((rel: { type: string; attributes: { fileName: string; }; }) => {
                  if (rel.type === 'cover_art') {
                      img = rel.attributes.fileName;
                  }
              });
              item.attributes.tags.forEach((tag: { attributes: { name: { en: string; }; }; }) => {
                  tags.push(tag.attributes.name.en);
              });
              return <Grid2 key={i}>
                <MangaCard
                    id={item.id}
                    description={item.attributes.description.en ?? 'No description available.'}
                    title={item.attributes.title.en ?? item.attributes.title.ja ?? item.attributes.title.zh ?? 'Could not load title.'}
                    tags={tags} link={`https://mangadex.org/title/${item.id}`}
                    img={`https://uploads.mangadex.org/covers/${item.id}/${img}`}
                    latestChapter={lastChapter}
                    status={status} />
                </Grid2>;
          })}
    </Grid2>
    <Button onClick={() => {setOffset(offset + 10); console.log(offset)}}>Load more</Button>
    </Container>
  )
}

export default HomePage
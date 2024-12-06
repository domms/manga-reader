import { Card, CardMedia, CardContent, Typography, Box, Link, Button } from "@mui/material"
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useNavigate } from "react-router";

interface Props {
    id: string;
    description: string;
    title: string;
    tags: string[];
    link: string;
    img: string;
    status: string;
    latestChapter: string;
}
const MangaCard = (props: Props) => {
const navigate = useNavigate();
  return ( 
    <Card sx={{ display: 'flex', height: '358.39px', width: '500px' }}>
    <CardMedia
        component="img"
        sx={{ height: '358.39px', width: '256px' }}
        image={props.img ?? 'Image not found.'}
        alt={`${props.title} cover image not found.`}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {props.title.length <= 18 ? props.title : (props.title.substr(0, 52) + "...")}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            {props.tags.map((tag: string, index: number) => {
                if(props.tags.length > 4){
                    props.tags.splice(4, props.tags.length-1)
                }
                return <Typography key={index} variant="caption">{index !== props.tags.length-1 ? `${tag}, ` : `${tag}`} </Typography>
            })}
          </Typography>
          <Link>Latest chapter released: {props.latestChapter}</Link>
          <Typography variant="subtitle2" color={props.status === "completed" ? "success" : "yellow"}>
            {props.status}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', pl: 1, pb: 1 }}>
        <Button onClick={() => {navigate(`Manga/${props.id}`, {state:{details: props}})}} variant='outlined' color="success" sx={{justifyContent: 'center'}}><AutoStoriesIcon sx={{marginRight: 1}}/> Start reading</Button>
        </Box>
      </Box>
    </Card>
  )
}

export default MangaCard
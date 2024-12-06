import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Link, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocation, useNavigate } from "react-router";

dayjs.extend(relativeTime);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

interface Props {
  chapterItems: ChapterDetails[];
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

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function createData(id: string, chapter: string, title: string, volume: string, pages: string, readableAt: string) {
    return { id, title, chapter, volume, pages, readableAt };
  }

export default function CustomPaginationActionsTable(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const rows: [{id: string, chapter: string, title: string, volume: string, pages: string, readableAt: string}] = [{
    id: '',
    chapter: '',
    title: '',
    volume: '',
    pages: '',
    readableAt: ''
  }];

  props.chapterItems.forEach((item) => {
    return rows.push(createData(`${item.id}`, `Chapter ${item.attributes.chapter ?? '?'}`, `${item.attributes.title && item.attributes.title.length > 0 && item.attributes.title !== 'null' ? item.attributes.title : ''}`, ` Volume: ${item.attributes.volume ?? '-'}`, `Pages: ${item.attributes.pages}`, `${item.attributes.readableAt}`));
  })

  console.log('chaps:',rows)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, i) => (
            <TableRow key={i}>
              <TableCell style={{ width: 160 }} align="left">
                <Link onClick={() => {navigate(`Read/${row.id}`, {state: { from: location, chapter: row.id, chapterList: props.chapterItems, mangaId:location.state.details.id }})}} noWrap>
                  {row.chapter + `${row.title ? ': ' : ''}` + row.title}
                </Link>
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {row.pages}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.volume}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                <Typography noWrap fontSize={'inherit'}>
                  {row.readableAt ? `Released: ${dayjs(row.readableAt).fromNow()}` : ''}
                </Typography>  
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
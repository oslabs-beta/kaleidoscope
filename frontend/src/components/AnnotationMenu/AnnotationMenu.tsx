// Component to render the annotation menu
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    node: boolean,
    trace: boolean,
    date: string,
    title: string,
    body: string
) {
    return { node, trace, date, title, body };
}

const rows = [
    createData(true, false, '2021-10-01', 'Node 1', 'This is a node'),
    createData(false, true, '2021-10-02', 'Trace 1', 'This is a trace'),
    createData(true, false, '2021-10-03', 'Node 2', 'This is a node'),
];

export const AnnotationMenu = (annotations) => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Node or Trace</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Body</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.date}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">
                    {row.node ? "Node" : "Trace"}
                </TableCell>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.body}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

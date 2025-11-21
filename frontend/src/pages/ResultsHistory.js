import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

function ResultsHistory() {
  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>
          Analysis History
        </Typography>
        
        <Box style={{ textAlign: 'center', padding: 60 }}>
          <Typography variant="body1" color="textSecondary">
            Analysis history feature coming soon. 
            Results are currently saved manually using the "Save Results" button.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ResultsHistory;

import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddedToCartSection from '../components/AddedToCartSection';
import OutForDeliverySection from '../components/OutForDeliverySection';

const ShowOrders = () => {

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Kosárba téve" {...a11yProps(0)} />
          <Tab label="Megrendelések" {...a11yProps(1)} />
          <Tab label="Végrehajtott Rendelések" {...a11yProps(2)} />
          <Tab label="Visszautasítottak" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AddedToCartSection />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <OutForDeliverySection status="Processing"/> 
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <OutForDeliverySection status="Succes" /> 
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <OutForDeliverySection status="Canceled"/> 
      </CustomTabPanel>
    </Box>
  );
}

export default ShowOrders

const CustomTabPanel = ({ children, value, index, ...other }) => {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
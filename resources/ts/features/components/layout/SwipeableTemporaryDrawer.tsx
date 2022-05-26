import * as React from 'react';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));


export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

    const closeSidebar = () => {
      setTimeout(() => {
          document.body.classList.remove('sidebar-open')
      }, 100);
    }

  const list = (anchor: Anchor) => (
    <Box
      sx={{ 
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 , 
        backgroundColor: 'white',
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Puller />
      <List>
          <>
            <Link 
              to={"/post/add"}
              style={{ textDecoration: 'none', color: '#333', fontSize: '24px', fontWeight: 'bolder'}} 
              onClick={closeSidebar}
            >
              <ListItem button>
                <ListItemIcon>
                    <i className='bx bx-message-detail' style={{color: '#333', fontSize: '24px'}} ></i> 
                </ListItemIcon>
                <ListItemText primary='つぶやく' />
              </ListItem>
            </Link>

            <Link 
              to={"/roadmap/add"}
              style={{ textDecoration: 'none', color: '#333', fontSize: '24px', fontWeight: 'bolder'}} 
              onClick={closeSidebar}
            >
              <ListItem button>
                <ListItemIcon>
                    <i className='bx bx-paper-plane' style={{color: '#333', fontSize: '24px'}}  ></i>
                </ListItemIcon>
                <ListItemText primary='計画作成' />
              </ListItem>
            </Link>
          </>
      </List>
    </Box>
  );

  return (
    <div>
        <React.Fragment key="bottom">
          <div className={`sidebar__menu__item`} onClick={toggleDrawer("bottom", true)}>
            <div className="sidebar__menu__item__icon">
                <i className='bx bx-pencil'></i>
            </div>
            <div className="sidebar__menu__item__txt">
                新規作成
            </div>
          </div>

          <SwipeableDrawer
            anchor={"bottom"}
            open={state["bottom"]}
            onClose={toggleDrawer("bottom", false)}
            onOpen={toggleDrawer("bottom", true)}
          >
            {list("bottom")}
          </SwipeableDrawer>
        </React.Fragment>
    </div>
  );
}

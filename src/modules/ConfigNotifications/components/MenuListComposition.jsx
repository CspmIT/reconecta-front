import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, IconButton } from '@mui/material';
import { Edit, Delete as DeleteIcon } from '@mui/icons-material';
import { FaCogs } from "react-icons/fa";
import ModalData from './ModalData';
import Swal from 'sweetalert2';

export default function MenuListComposition({ id }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);
  const [openModal, setOpenModal] = useState(false);

  const handleClose = useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  }, []);

  const handleListKeyDown = useCallback((event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  }, []);

  const handleEdit = useCallback((event) => {
    handleClose(event);
    setOpenModal(true);
  }, []);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const deleteEvent = () => {
    Swal.fire({
      title: "Atención!",
      text: "¿Estás seguro de eliminar este evento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('eliminar');
      }
    });
  }

  return (
    <div>
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        className='!bg-[#858796] hover:!bg-[#717384] !text-white !shadow-md'
      >
        <FaCogs />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal={false}
        modifiers={[{ name: 'preventOverflow', options: { boundary: 'window' } }]}
        style={{ zIndex: 9999, position: 'relative' }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleEdit}>
                    <Edit className='mr-2 text-yellow-500' /> Editar
                  </MenuItem>
                  <MenuItem onClick={() => deleteEvent()}>
                    <DeleteIcon className='mr-2 text-red-500' /> Eliminar
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <ModalData setOpenModal={setOpenModal} openModal={openModal} />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Box, Heading, Input, Button, Text, VStack, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newNote.trim() !== "") {
      const note = {
        id: Date.now(),
        text: newNote,
      };
      setNotes([...notes, note]);
      setNewNote("");
      toast({
        title: "Note created",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    toast({
      title: "Note deleted",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEdit = (id, text) => {
    const updatedNotes = notes.map((note) => (note.id === id ? { ...note, text } : note));
    setNotes(updatedNotes);
    setEditingNoteId(null);
  };

  return (
    <Box maxWidth="600px" margin="auto" p={4}>
      <Heading mb={8}>Note Taking App</Heading>
      <form onSubmit={handleSubmit}>
        <HStack mb={4}>
          <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Enter a new note" />
          <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
            Add Note
          </Button>
        </HStack>
      </form>
      <VStack spacing={4} align="stretch">
        {notes.map((note) => (
          <HStack key={note.id} justify="space-between">
            {editingNoteId === note.id ? (
              <Input
                value={note.text}
                onChange={(e) => handleEdit(note.id, e.target.value)}
                onBlur={() => setEditingNoteId(null)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") setEditingNoteId(null);
                }}
              />
            ) : (
              <Text onClick={() => setEditingNoteId(note.id)}>{note.text}</Text>
            )}
            <IconButton icon={<FaTrash />} onClick={() => handleDelete(note.id)} aria-label="Delete note" />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;

import React, { useState, useEffect } from "react";
import { Box, Heading, Input, Button, Text, VStack, HStack, IconButton, useToast, Grid, Image } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";

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

  const handleImageUpload = (e, noteId) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result;
      setNotes((prevNotes) => prevNotes.map((note) => (note.id === noteId ? { ...note, image: base64data } : note)));
    };
  };

  return (
    <Box maxWidth="1200px" margin="auto" p={4}>
      <Heading mb={8}>Note Taking App</Heading>
      <form onSubmit={handleSubmit}>
        <HStack mb={4}>
          <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Enter a new note" />
          <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
            Add Note
          </Button>
        </HStack>
      </form>
      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
        {notes.map((note) => (
          <Box key={note.id} bg="gray.100" p={4} borderRadius="md" boxShadow="md">
            {editingNoteId === note.id ? (
              <>
                <Input
                  value={note.text}
                  onChange={(e) => handleEdit(note.id, e.target.value)}
                  onBlur={() => setEditingNoteId(null)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") setEditingNoteId(null);
                  }}
                />
                <HStack mt={2}>
                  <input type="file" onChange={(e) => handleImageUpload(e, note.id)} style={{ display: "none" }} id={`image-input-${note.id}`} />
                  <label htmlFor={`image-input-${note.id}`}>
                    <IconButton icon={<FaImage />} aria-label="Attach Image" as="span" />
                  </label>
                </HStack>
              </>
            ) : (
              <>
                <Text onClick={() => setEditingNoteId(note.id)} mb={2}>
                  {note.text}
                </Text>
                {note.image && <Image src={note.image} alt="Note Image" mb={2} />}
              </>
            )}
            <IconButton icon={<FaTrash />} onClick={() => handleDelete(note.id)} aria-label="Delete note" />
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Index;

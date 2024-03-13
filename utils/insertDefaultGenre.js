const Genre = require('../models/genre');

const genres = [
    {
      name: 'Pop',
      description: 'Pop music is characterized by catchy melodies, rhythmic beats, and a broad appeal to a wide audience.'
    },
    {
      name: 'Rock',
      description: 'Rock music features guitar-driven sound, energetic performances, and often explores themes of rebellion and individualism.'
    },
    {
      name: 'Hip Hop',
      description: 'Hip Hop is a genre of music that originated in African American and Latinx communities, known for its rhythmic beats, rap vocals, and lyrical storytelling.'
    },
    {
      name: 'R&B',
      description: 'R&B (Rhythm and Blues) combines elements of soul, funk, and pop music, known for its smooth vocals, groove-oriented sound, and romantic themes.'
    },
    {
      name: 'Country',
      description: 'Country music is rooted in folk traditions and often features storytelling lyrics, acoustic instruments, and themes of rural life and relationships.'
    },
    {
      name: 'Jazz',
      description: 'Jazz is a genre characterized by improvisation, syncopated rhythms, and unique harmonic structures, with influences from African, European, and American musical traditions.'
    },
    {
      name: 'Other',
      description: 'Other genres'
    }
  ];
  

const insertDefaultGenre = async () => {
    for (const genre of genres) {
        try {
            const existingGenre = await Genre.findOne({ name: genre.name });
        
            if (!existingGenre) {
                await Genre.create({ name: genre.name, description: genre.description })
            }
        } catch (error) {
            console.error('Error inserting default genre:', error);
        }

    }
};

module.exports = insertDefaultGenre
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {useState, useEffect} from "react";
import {Stack} from "expo-router";

function fetchData(endpointUrl: string, callback: any) {
    fetch(endpointUrl)
        .then(response => response.json())
        .then(data => callback(null, { data }))
        .catch(error => callback(error, { data: null }));
}

function PokemonList({ navigation }) {
    const pokemonAPIv2 = 'https://pokeapi.co/api/v2/pokemon';
    const [pokemonList, setPokemonList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData(pokemonAPIv2, (error: any, response: any) => {
            if (error) {
                console.error('Callback Error:', error);
            } else {
                if (response?.data?.results?.length > 0) {
                    setPokemonList(response.data.results);
                }
            }
        });
    }, []);

    function handleOnChange(text: string) {
        setSearchQuery(text);
        if (text) {
            const filtered = pokemonList.filter((item) => item.name.includes(text.toLowerCase()));
            setPokemonList(filtered.length > 0 ? filtered : []);
        } else {
            fetchData(pokemonAPIv2, (error: any, response: string) => {
                if (error) {
                    console.error('Callback Error:', error);
                } else {
                    if (response?.data?.results?.length > 0) {
                        setPokemonList(response.data.results);
                    }
                }
            });
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search Pokemon"
                value={searchQuery}
                onChangeText={handleOnChange}
            />
            <FlatList
                data={pokemonList}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Pokemon', { name: item.name })}>
                        <Text style={styles.listItem}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

function Pokemon({ route }) {
    const pokemonAPIv2 = 'https://pokeapi.co/api/v2/pokemon';
    const { name } = route.params;
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        fetchData(`${pokemonAPIv2}/${name}`, (error, response) => {
            if (error) {
                console.error('Callback Error:', error);
            } else {
                setPokemon(response.data);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{pokemon?.name}</Text>
        </View>
    );
}


export default function HomeScreen() {
  return (
      <NavigationContainer>
          <Stack>
              <Stack.Screen name="PokemonList" component={PokemonList} options={{ title: 'Pokemon List' }} />
              <Stack.Screen name="Pokemon" component={Pokemon} options={{ title: 'Pokemon Details' }} />
          </Stack>
      </NavigationContainer>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    listItem: {
        padding: 15,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

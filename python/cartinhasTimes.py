import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt
import re
import json
import numpy as np

def limparJson():
    data = ["jogadores.json", "times.json", "top.json", "jungle.json", "mid.json", "bot.json", "support.json"]
    
    for row in data:
        position = row
        filename = position.lower()
        with open(filename, 'w'):
            pass

def extract_champion_data(champion_info):
    champion = ''
    winrate = ''
    kda = ''
    times_played = ''
    
    match_champion = re.search(r'(.+?)\s+Winrate', champion_info)
    if match_champion:
        champion = match_champion.group(1).strip()
    
    match_winrate = re.search(r'Winrate\s*:\s*([\d.]+%?)', champion_info)
    if match_winrate:
        winrate = match_winrate.group(1).strip()
    
    match_kda = re.search(r'KDA\s*:\s*([\d.]+)', champion_info)
    if match_kda:
        kda = match_kda.group(1).strip()
    
    match_games = re.search(r'KDA\s*:\s*[\d.]+\s*\n\r\n\s*(\d+)', champion_info)
    if match_games:
        times_played = match_games.group(1).strip()
    
    return {
        'Champion': champion,
        'Winrate': winrate,
        'KDA': kda,
        'Times Played': times_played
    }

def extract_teams_data(url, time):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.find('table', class_='footable')

        if table:
            data = []
            for row in table.find_all('tr'):
                columns = row.find_all(['td', 'th'])
                data.append([column.text.strip() for column in columns])

            max_columns = max(len(row) for row in data)

            data = [row + [''] * (max_columns - len(row)) for row in data]

            data = np.delete(data, 0, axis=0)
            data = data.tolist()
            
            for row in data:
                if len(row) == 8:
                    champion_info = row[-1]
                    champion_data = extract_champion_data(champion_info)
                    row[-1] = champion_data
            
            if(data[0][0] == 'Last line-up'):
                data = np.delete(data, 0, axis=0)
                data = data.tolist()
                
            if(len(data) > 5):
                data = np.delete(data, 5, axis=0)
                data = data.tolist()
            
            for index, row in enumerate(data):
                position = row[0]

                player_data = {'time': time}
                player_stats = {f"Player": row[1], "Campeao": row[7]}
                player_data.update(player_stats)

                filename = position.lower() + '.json'

                # print(data)

                with open(filename, 'a+') as f:
                    json.dump(player_data, f)
                    # f.write('\n')

            # df = pd.DataFrame(data[1:], columns=data[0])
            
            # fig, ax = plt.subplots(figsize=(10, 6))
            # ax.axis('off')

            # tab = ax.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center', colColours=['#f0f0f0']*len(df.columns))
            # tab.auto_set_font_size(False)
            # tab.set_fontsize(10)

            # tab.auto_set_column_width([i for i in range(len(df.columns))])

            # plt.savefig(f"tabela {time}.png", bbox_inches='tight', pad_inches=0.5)
        else:
            print("Nenhuma tabela encontrada no site.")
    else:
        print('Erro ao acessar o site:', response.status_code)

def extract_players_data(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.find('table', class_='table_list')

        if table:
            data = []
            for row in table.find_all('tr'):
                columns = row.find_all(['td', 'th'])
                data.append([column.text.strip() for column in columns])

            data = np.delete(data, 0, axis=0)
            data = data.tolist()

            print(data)

            with open('jogadores.json', 'a+') as f:
                    json.dump(data, f)
        else:
            print("Nenhuma tabela encontrada no site.")
    else:
        print('Erro ao acessar o site:', response.status_code)

limparJson()
url_players = "https://gol.gg/players/list/season-ALL/split-ALL/tournament-MSI%202024/"
url_team = "https://gol.gg/teams/list/season-ALL/split-ALL/tournament-MSI%202024/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

response = requests.get(url_team, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find('table', class_='table_list')

    if table:
        for row in table.find_all('tr'):
            columns = row.find_all(['td', 'th'])
            if columns and columns[0].find('a'):
                href = columns[0].find('a')['href']
                href = href.replace('.', 'https://gol.gg/teams').replace(' ', '%20')
                with open('times.json', 'a+') as f:
                    json.dump(columns[0].text.strip(), f)
                    f.write('\n')
                    
                extract_teams_data(href, columns[0].text.strip())
    else:
        print("Nenhuma tabela encontrada no site.")
else:
    print('Erro ao acessar o site:', response.status_code)

extract_players_data(url_players)
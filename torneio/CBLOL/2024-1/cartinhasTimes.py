import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt
import re
import json
import numpy as np

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
    
    # Modificado para capturar o número após o KDA
    match_games = re.search(r'KDA\s*:\s*[\d.]+\s*\n\r\n\s*(\d+)', champion_info)
    if match_games:
        times_played = match_games.group(1).strip()
    
    return {
        'Champion': champion,
        'Winrate': winrate,
        'KDA': kda,
        'Times Played': times_played  # Adicionado aqui
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

            # Encontre o número máximo de colunas
            max_columns = max(len(row) for row in data)

            # Certifique-se de que todas as linhas tenham o mesmo número de colunas
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
                
            print(data)
            json_data = json.dumps(data)
            
            with open('cartinhas.json', 'w') as f:
                f.write(json_data)
            
            df = pd.DataFrame(data[1:], columns=data[0])
            
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.axis('off')

            tab = ax.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center', colColours=['#f0f0f0']*len(df.columns))
            tab.auto_set_font_size(False)
            tab.set_fontsize(10)

            tab.auto_set_column_width([i for i in range(len(df.columns))])

            plt.savefig(f"tabela {time}.png", bbox_inches='tight', pad_inches=0.5)
            # plt.show()
            
        else:
            print("Nenhuma tabela encontrada no site.")
    else:
        print('Erro ao acessar o site:', response.status_code)

url = "https://gol.gg/teams/list/season-ALL/split-ALL/tournament-CBLOL%20Split%201%202024/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find('table', class_='table_list')

    if table:
        for row in table.find_all('tr'):
            columns = row.find_all(['td', 'th'])
            if columns and columns[0].find('a'):
                href = columns[0].find('a')['href']
                href = href.replace('.', 'https://gol.gg/teams').replace(' ', '%20')
                print(columns[0].text.strip())
                extract_teams_data(href, columns[0].text.strip())
    else:
        print("Nenhuma tabela encontrada no site.")
else:
    print('Erro ao acessar o site:', response.status_code)
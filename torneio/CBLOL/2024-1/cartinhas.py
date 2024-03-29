import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt

url = "https://gol.gg/players/list/season-S14/split-ALL/tournament-CBLOL%20Split%201%202024/"
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

        print(data)

        df = pd.DataFrame(data[1:], columns=data[0])

        fig, ax = plt.subplots(figsize=(10, 6))
        ax.axis('off')

        tab = ax.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center', colColours=['#f0f0f0']*len(df.columns))
        tab.auto_set_font_size(False)
        tab.set_fontsize(10)

        tab.auto_set_column_width([i for i in range(len(df.columns))])

        plt.savefig('tabela.png', bbox_inches='tight', pad_inches=0.5)
        # plt.show()
    else:
        print("Nenhuma tabela encontrada no site.")
else:
    print('Erro ao acessar o site:', response.status_code)

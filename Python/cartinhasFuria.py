import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt
import re
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/get_data_furia', methods=['GET'])
def get_data():
    url = "https://gol.gg/teams/team-stats/2177/split-ALL/tournament-CBLOL%20Split%201%202024/"
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
                row_data = [re.sub(r'\s+', ' ', column.text.strip().replace('\r\n', '')) for column in columns]
                data.append(row_data)

            formatted_data = []
            for row in data[1:]:
                if len(row) == 8:
                    role, player, kda, kp, vspm, dmg, gold, champions_played = row
                    champions_data = re.split(r'\s{2,}', champions_played)
                    formatted_row = [role, player, kda, kp, vspm, dmg, gold]
                    formatted_row.extend(champion.strip() for champion in champions_data if champion.strip())
                    formatted_data.append(formatted_row)

            # print("Columns:", data[0])
            # print("Data:", data[1:])

            # df = pd.DataFrame(data[1:], columns=data[0])

            # fig, ax = plt.subplots(figsize=(10, 6))
            # ax.axis('off')

            # tab = ax.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center', colColours=['#f0f0f0']*len(df.columns))
            # tab.auto_set_font_size(False)
            # tab.set_fontsize(10)

            # tab.auto_set_column_width([i for i in range(len(df.columns))])

            # plt.savefig('tabelaFuria.png', bbox_inches='tight', pad_inches=0.5)
            # plt.show()

                return render_template('data_template.html', data=formatted_data)
        else:
            # return jsonify({'error': 'Nenhuma tabela encontrada no site.'}), 404
            return "0"
    else:
        return "0"
        # return jsonify({'error': f'Erro ao acessar o site: {response.status_code}'}), 500
if __name__ == '__main__':
    app.run(debug=True)

import os
import logging
import dash
import dash_core_components as dcc
import dash_html_components as html
import dash_bootstrap_components as dbc
from dash.dependencies import Input, Output, State
import pandas as pd
from image_recognition.image_recognition import image_rec
import base64
import json
from pprint import pprint

recycle_df = pd.read_csv('../test_data/recyclable_table.csv')
found_in_list = list(recycle_df['found_in'].values)
found_in_options = [{'label': f"{symbol}", 'value': symbol} for symbol in found_in_list]

external_stylesheets = [dbc.themes.LITERA]

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)
server = app.server

app.logger.setLevel(logging.DEBUG)

# To be able to assign callbacks before layout
app.config["suppress_callback_exceptions"] = True

# set layout options
app.title = 'RECYCLE RIGHT'

# Favicon
app.head = [
    html.Img(
        src='assets/favicon.ico',
    ),
]

upload_tab = html.Div(
    children=[
        html.H4("Image Classifier"),
        dcc.Upload(
            id='upload_image',
            children=html.Div([
                'Drag and Drop or ',
                html.A('Select Files')
            ]),
            style={
                'width': '100%',
                'height': '40px',
                'lineHeight': '20px',
                'borderWidth': '2px',
                'borderStyle': 'dashed',
                'borderRadius': '10px',
                'textAlign': 'center',
            },
            # Allow multiple files to be uploaded
            multiple=False
        )
    ],
    style={
        'marginLeft': '3%',
        'marginRight': '3%',
    }
)

search_bar = html.Div(
    children=[
        html.H4("Material Selection"),
        dcc.Dropdown(
            options=found_in_options,
            id='recycle_dropdown',
            multi=False,
        )
    ],
    style={
        'marginLeft': '3%',
        'marginRight': '3%',
    }
)

navbar = dbc.Navbar(
    children=[
        html.Img(
            src=app.get_asset_url('logo.png'),
            height="60px",
            style={'marginRight': '1em'}),

        html.H2("Recycle Right")
    ],

    style={'marginBottom': '1em'}
)

body = html.Div(
    children=[
        dbc.Row(
            [
                dbc.Col(html.Div(children=[upload_tab]), width=6),
                dbc.Col(html.Div(children=[search_bar]), width=6),
            ],
        ),

        html.Div(id='output-image-upload'),

        html.Div(id='output-dropdown'),

    ]
)

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(children=[
        navbar,
        body
    ], id='page-content')
])


@app.callback(Output('output-dropdown', 'children'),
              [Input('recycle_dropdown', 'value')])
def update_output_from_dropdown(value):
    if value:

        if value in found_in_list:

            subset_df = recycle_df[recycle_df['found_in']==value]

            recycleable_number = subset_df['recycleable_number'].values[0]

            acronym = subset_df['acronym'].values[0]

            chemical_name = subset_df['chemical_name'].values[0]

            usage = subset_df['usage'].values[0]

            return html.Div(
                children=[html.H4("Material Classification:"),
                          html.H5(f'{chemical_name} - {acronym}'),
                          html.H5(f'Recycling Number: {recycleable_number} '),
                          html.H5(f'{usage}')
                          ],
                style={
                    'marginTop': '1em',
                    'marginLeft': '3%',
                    'marginRight': '3%',
                }
            )


@app.callback(Output('output-image-upload', 'children'),
              [Input('upload_image', 'contents')])
def update_output(image):
    if image:
        image = (image.replace('data:image/jpeg;base64,', '')).encode('utf-8')

        file_path = os.path.join(os.getcwd(), 'temp_upload_directory', "temp_img.png")

        with open(file_path, "wb") as fh:
            fh.write(base64.decodebytes(image))

        img_dict = image_rec(image_path=file_path)

        os.remove(file_path)

        r_number = int(list(img_dict.keys())[0])
        subset_df = recycle_df[recycle_df['recycleable_number'] == r_number]

        acronym = subset_df['acronym'].values[0]

        chemical_name = subset_df['chemical_name'].values[0]

        usage = subset_df['usage'].values[0]

        found_in = list(subset_df['found_in'].values)

        return html.Div(
            children=[html.H4("Material Classification:"),
                      html.H5(f'{chemical_name} - {acronym}'),
                      html.H5(f'Recycling Number: {r_number} '),
                      html.H5(f'{usage}')
                      ],
            style={
                'marginTop': '1em',
                'marginLeft': '3%',
                'marginRight': '3%',
            }
        )


@app.callback(Output('page-content', 'children'),
              [Input('url', 'pathname')])
def display_page(pathname):
    if pathname:
        return [navbar, body]


if __name__ == '__main__':
    app.run_server(host='0.0.0.0', port=8050, debug=False)

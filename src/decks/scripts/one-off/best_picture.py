for i in range(14, 98):
    if i % 10 == 1:
        suffix = 'st'
    elif i % 10 == 2:
        suffix = 'nd'
    elif i % 10 == 3:
        suffix = 'rd'
    else:
        suffix = 'th'

    print(f'{i}{suffix} Academy Awards, {1928 + i}')

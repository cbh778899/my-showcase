function calculateMinDimensions(width, height, maxWidth, maxHeight) {
    const dimensions = {}
    if(width >= height) {
        dimensions.height = maxHeight;
        dimensions.width = maxHeight * (width / height);
    } else {
        dimensions.width = maxWidth;
        dimensions.height = maxWidth * (height / width);
    }
    
    return dimensions;
}

export function calculateDefaultImageScale(width, height, maxWidth, maxHeight) {
    const dimensions = calculateMinDimensions(width, height, maxWidth, maxHeight)
    if(width >= height) {
        dimensions.x = - (dimensions.width - maxWidth) / 2;
        dimensions.y = 0;
    } else {
        dimensions.y = - (dimensions.height - maxHeight) / 2;
        dimensions.x = 0;
    }
    
    return dimensions;
}

export function validateMovement(new_x, new_y, width, height, maxWidth, maxHeight) {
    if(new_x > 0) {
        new_x = 0;
    } else if(new_x + width < maxWidth) {
        new_x = maxWidth - width
    }

    if(new_y > 0) {
        new_y = 0;
    } else if(new_y + height < maxHeight) {
        new_y = maxHeight - height
    }

    return {x: new_x, y: new_y}
}

export function validateScale(new_w, new_h, new_x, new_y, maxWidth, maxHeight) {
    let dimensions = 
        (new_w < maxWidth || new_h < maxHeight) ? 
        calculateMinDimensions(new_w, new_h, maxWidth, maxHeight) :
        {width: new_w, height: new_h};
    
    dimensions = {
        ...dimensions,
        ...validateMovement(
            new_x, new_y, 
            dimensions.width, dimensions.height,
            maxWidth, maxHeight)
    }

    return dimensions
}